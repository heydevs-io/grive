import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageMetaDto } from '../dtos';

export class ResponseDto<TData> {
  status: number;

  message: string;

  data: TData;
}

interface ClassConstructor<T = any> {
  new (...args: any[]): T;
}

export const CustomApiResponse = (model: ClassConstructor, array = false) => {
  if (model) {
    const data = array
      ? {
          type: 'array',
          items: {
            $ref: getSchemaPath(model),
          },
        }
      : { $ref: getSchemaPath(model) };

    return applyDecorators(
      ApiExtraModels(ResponseDto, PageMetaDto, model),
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(ResponseDto) },
            {
              properties: {
                status: {
                  type: 'number',
                  example: 200,
                },
                message: {
                  type: 'string',
                  example: 'success',
                },
                data,
              },
            },
          ],
        },
      }),
    );
  }

  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              status: {
                type: 'number',
                example: 200,
              },
              message: {
                type: 'string',
                example: 'success',
              },
            },
          },
        ],
      },
    }),
  );
};

export const CustomApiPaginatedResponse = (model: ClassConstructor) => {
  if (model) {
    return applyDecorators(
      ApiExtraModels(ResponseDto, PageMetaDto, model),
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(ResponseDto) },
            {
              properties: {
                status: {
                  type: 'number',
                  example: 200,
                },
                message: {
                  type: 'string',
                  example: 'success',
                },
                data: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: getSchemaPath(model),
                      },
                    },
                    meta: { $ref: getSchemaPath(PageMetaDto) },
                  },
                },
              },
            },
          ],
        },
      }),
    );
  }

  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              status: {
                type: 'number',
                example: 200,
              },
              message: {
                type: 'string',
                example: 'success',
              },
              data: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    example: [],
                  },
                  meta: { $ref: getSchemaPath(PageMetaDto) },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
